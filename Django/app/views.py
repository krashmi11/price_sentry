import threading
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
import random
import requests
from bs4 import BeautifulSoup as bs
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from twilio.rest import Client
import os
import time
from dotenv import load_dotenv
import google.generativeai as genai
from fuzzywuzzy import fuzz

# Configure API key
genai.configure(api_key='')


load_dotenv()
#user-agents for making requests to the website
user_agents = [
    "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    
] 

from apscheduler.schedulers.background import BackgroundScheduler
import time
from apscheduler.triggers.interval import IntervalTrigger
import atexit
scheduler = BackgroundScheduler()
scheduler.start()
atexit.register(lambda: scheduler.shutdown(wait=False))

def stop_scheduler(pid):
    if scheduler.get_job(str(pid)):
        scheduler.remove_job(str(pid))
        print(f"Scheduler stopped for product ID: {pid}")

def job(url, pid, threshold, to_address,website):
    url=url.strip()
    if(website.lower()=="flipkart"):
        title, price = price_monitor(url)
    elif(website.lower()=="amazon"):
        title, price = get_amazon(url)
    elif(website.lower()=="meesho"):
        title, price = get_meesho_product(url)
    elif(website.lower()=="nykaa"):
        title, price = get_nykaa_product(url)
    elif(website.lower()=="shopsy"):
        title, price = get_Shopsy(url)
    price = price.replace(",", "")
    if title and price:
        success = store_track_record(url, title, price[1:], pid)
        if not success:
            stop_scheduler(pid)
            return        
        if float(price[1:]) <= threshold:
            send_email(from_address, to_address, smtp_server, title, price, smtp_port, login, password, url)
            stop_scheduler()
            return Response({'status': 200, 'message': 'Successful'})
    else:
        print("Failed to retrieve product details.")


def store_track_record(url,product_title, price,pid):
    spring_boot_url =f"http://localhost:8080/api/track-products/{pid}"

    data = {
        "productLink": url,
        "price": float(price),
        "product_title":product_title,
    }
    response = requests.post(spring_boot_url, json=data)
    if response.status_code == 200:
        print("Data stored in prodcutTracking Database!")
        return True
    else:
        print("Failed to send data to Spring Boot")
        return False

def start_scheduler(url, pid, threshold, to_address,website):
    scheduler.add_job(
        job,
        trigger=IntervalTrigger(minutes=1),
        id=str(pid),
        args=[url, pid, threshold, to_address,website],
        replace_existing=True
    )
    print(f"Scheduler started for product ID: {pid}")

# Create your views here.
@api_view(['GET'])
def test(request):
    return Response({'status':200})


# check whether limits are reached or not
def fetch_page(url, max_retries=5):
    print('url in fetch: ',url,type(url))
    # headers = {
    #     'User-Agent': random.choice(user_agents),
    #     'Referer': 'https://www.google.com/',
    #     'Accept-Language': 'en-US,en;q=0.5'
    # }
    retry_count = 0
    while retry_count < max_retries:
        headers = {
            'User-Agent': random.choice(user_agents),
            'Referer': 'https://www.google.com/',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        }
        response = requests.get(url, headers=headers)
        if response.status_code!=200:
            retry_after = int(response.headers.get("Retry-After", 60))
            print(f"Rate limited. Retrying after {retry_after} seconds...")
            time.sleep(retry_after)
            retry_count += 1
        else:
            return response
    return None


#monitor the price for your product
def price_monitor(url):
    print(url)
    response = fetch_page(url)
    if response is None or response.status_code == 429:
        print("Failed to retrieve the page due to rate limiting.")
        return None
    print(response)
    soup=bs(response.content,'html.parser') 
    div=soup.find('div',class_="C7fEHH")
    title=soup.find('span',class_="VU-ZEz").text or div.find('span',class_="VU-ZEz").text
    price_div = soup.find('div', class_='Nx9bqj CxhGGd') 
    if price_div:
        price = price_div.text
    else:
        print("Price not found")
    return title,price

def get_nykaa_product(url):
    response=fetch_page(url)
    if response is None or response.status_code == 429:
        print("Failed to retrieve the page due to rate limiting.")
        return None
    print(response)
    soup = bs(response.content, 'html.parser')
    title=soup.find('h1',{'class':'css-1gc4x7i'}).text.strip()
    price_div=soup.find('span',{'class':'css-1jczs19'})
    if price_div:
        price = price_div.text
    else:
        print("Price not found")
    return title,price

def get_amazon(url):
    response=fetch_page(url)
    if response is None or response.status_code == 429:
        print("Failed to retrieve the page due to rate limiting.")
        return None
    print(response)
    soup = bs(response.content, 'html.parser')
    outer_div=soup.find('div',{'id':'ppd'}) 
    title=""
    price=""
    if outer_div:   
        title=outer_div.find('span',{'id':'productTitle'}).text.strip()
        print("title:",title)
        price_div=outer_div.find('span',{'class':'a-price-whole'})
        if price_div:
            price ='$'+price_div.text
        else:
            print("Price not found")
    
    print(title," ",price)
    return title,price

def get_meesho_product(url):
    response=fetch_page(url)
    if response is None or response.status_code == 429:
        print("Failed to retrieve the page due to rate limiting.")
        return None
    print(response)
    soup = bs(response.content, 'html.parser')
    title=soup.find('span','sc-eDvSVe fhfLdV').text.strip()
    price_div=soup.find('h4','sc-eDvSVe biMVPh')
    if price_div:
        price = price_div.text
    else:
        print("Price not found")
    return title,price

# def get_shopsy(url):
#     response=fetch_page(url)
#     if response is None or response.status_code == 429:
#         print("Failed to retrieve the page due to rate limiting.")
#         return None
#     print(response)
#     soup = bs(response.content, 'html.parser')
#     title_div=soup.find('span', class_='css-1jxf684')
#     if(title_div):
#         title=title_div.text.strip()
#         print(title)
#     price=soup.find('div','css-146c3p1 r-cqee49 r-1vgyyaa r-1x35g6 r-1rsjblm r-13hce6t').text.strip() or soup.find('div','css-146c3p1 r-cqee49 r-1vgyyaa r-1x35g6 r-1rsjblm').text.strip()
#     return title,price
from zenrows import ZenRowsClient


def get_Shopsy(url):
    client = ZenRowsClient("40438f4532711c79942f9931266be4ea4a94c37d")
    # url = "https://www.shopsy.in/boot-leg-men-dark-blue-jeans/p/itm6e14dc7106c6d?pid=XJNH2KVEH8FHQA8S&lid=LSTXJNH2KVEH8FHQA8SXA3HXO&marketplace=FLIPKART&store=clo%2Fvua%2Fk58%2Fi51"

    try:
        # Enable JavaScript rendering
        response = client.get(url, params={"js_render": "true"})

        # Check if the response is successful
        if response.status_code != 200:
            return None

        # Parse the HTML
        soup = bs(response.text, 'html.parser')
        title_div=soup.find('div',{'class':'css-175oi2r r-kzbkwu r-3pj75a r-tskmnb'})
        if title_div:
            title=title_div.find('span',{'class':'css-1jxf684'}).get_text(strip=True)
        else:
            title=soup.find('span',{'class':'css-1jxf684'}).get_text(strip=True)
        # Find the price element
        price_element = soup.find('div', class_='css-146c3p1 r-cqee49 r-1vgyyaa r-1x35g6 r-1rsjblm r-13hce6t')
        if not price_element:
            price_element = soup.find('div', class_='css-146c3p1')  # Fallback

        # Extract and return the price
        if price_element:
            price = price_element.get_text(strip=True)
            print(price)
        else:
            print("Price not found")

        return title,price
    except:
        return None

# Function to scrape specific product details from Flipkart
def get_flipkart_product(query):
    searchtext = query.replace(' ', '%20')
    flp_str1 = "https://www.flipkart.com/search?q="
    flp_query = flp_str1 + searchtext

    response = fetch_page(flp_query)
    if response is None:
        print("Failed to fetch the page.")
        return None

    soup = bs(response.content, 'html.parser')
    product = None
    best_match=0
    for item in soup.find_all("div", {"class": "cPHDOP col-12-12"}):
        try:
            title = item.find("div", {"class": "KzDlHZ"}).text.strip()
            price = item.find("div", {"class": "Nx9bqj _4b5DiR"}).text.strip()
            link = "https://www.flipkart.com" + item.find("a", {"class": "CGtC98"}).get("href")

            # Check if the title exactly matches the search query
            match_score = fuzz.partial_ratio(query.lower(), title.lower())

            if match_score > best_match and match_score >= 70:
                best_match = match_score
                product = {
                    "title": title,
                    "price": price,
                    "link": link
                }
        except AttributeError:
            continue

    return product

def get_shopsy_product(query):
# Shopsy API endpoint
    searchtext = query.replace(' ', '%20')
    flp_str1 = "https://www.shopsy.in/search?q="
    flp_query = flp_str1 + searchtext

    response = fetch_page(flp_query)
    if response is None:
        print("Failed to fetch the page.")
        return None

    soup = bs(response.content, 'html.parser')
    product = None
    best_match=0
    
    for item in soup.find_all("div", {"class": "sc-46489703-1 bjxoUG"}):
        try:
            title=item.find('div',{'class':'css-175oi2r'})
            title=item.find('div',{"class":'sc-c50e187b-0 bkNEtl'})
            
            price=item.find('div',{"class":"css-146c3p1 r-cqee49 r-1vgyyaa r-ubezar r-1rsjblm"}) or item.find('div',{'class':'css-146c3p1 r-cqee49 r-1vgyyaa r-1rsjblm r-13hce6t'})
        #    css-146c3p1 r-cqee49 r-1vgyyaa r-ubezar r-1rsjblm
            title_text = title.text.strip() if title else "Title not found"
            price_text = price.text.strip() if price else "Price not found"
            match_score = fuzz.partial_ratio(query.lower(), title_text.lower())

            if match_score > best_match and match_score >= 70:
                best_match = match_score
                product = {
                    "title": title_text,
                    "price": price_text
                }
        except AttributeError:
            continue

    return product
        

def get_amazon_product(query):
    # Amazon API endpoint
    searchtext = query.replace(' ', '%20')
    amz_str1 = "https://www.amazon.in/s?k="
    amz_str2 = "&ref=nb_sb_noss_2"

    amz_query = f"{amz_str1}{searchtext}{amz_str2}"
    # print(amz_query)
    response = fetch_page(amz_query)
    if response is None:
        print("Failed to fetch the page.")
        return None
    print(response)
    soup = bs(response.content, 'html.parser')
    product = None
    best_match = 0
    outer_div=soup.find("div", {"class": "s-main-slot s-result-list s-search-results sg-row"})
    for item in outer_div.find_all('div',{'class':'sg-col-20-of-24 s-result-item s-asin sg-col-0-of-12 sg-col-16-of-20 sg-col s-widget-spacing-small sg-col-12-of-16'}):
        try:
            title=item.find('span',{"class":"a-size-medium a-color-base a-text-normal"}).text.strip()
            price=item.find('span',{'class':'a-price-whole'}).text.strip() or item.find('span',{"class":"a-price"}).text.strip()
            link="https://www.amazon.in"+item.find("a",{"class":"a-link-normal s-underline-text s-underline-link-text s-link-style a-text-normal"}).get("href")
            match_score = fuzz.partial_ratio(query.lower(), title.lower())

            if match_score > best_match and match_score >= 70:
                best_match = match_score
                product = {
                    "title": title,
                    "price": "Rs" + price,
                    "link":link
                }
        except AttributeError:
            continue
    return product

@api_view(['POST'])
def compare_prices(request):
    try:
        query=request.data['productName'].strip()
        flipkart_pro = get_flipkart_product(query)
        shopsy_pro=get_shopsy_product(query)
        amazon_pro=get_amazon_product(query)
        price_analysis={
            "flipkart":flipkart_pro,
            "shopsy":shopsy_pro,
            "amazon":amazon_pro
        }
        return Response({'status': 200, 'message': 'Successful','price_analysis':price_analysis})
    except:
        return Response({'status': 400, 'message': 'Failed to fetch product details.'})



def send_to_spring_boot(url,product_title, price, threshold,username):
    spring_boot_url = "http://localhost:8080/api/products"
    data = {
        "productLink": url,
        "price": float(price),
        "threshold": int(threshold),
        "username":username,
        "product_title":product_title,
    }
    response = requests.post(spring_boot_url, json=data)
    if response.status_code == 200:
        print("Data sent to Spring Boot successfully!")
        product_id = response.json().get('id')  # Assuming the response contains the product ID
        return product_id
    else:
        print("Failed to send data to Spring Boot")
        return None


#send email if price go below your customized threshold
def send_email(from_address, to_address, smtp_server,product_title,product_price,smtp_port, login, password,url):
    # Create the container email message.

    subject = "Price Alert for {}".format(product_title)
    body = "The price for {} is now {}Rs.\nCheck it out here: {}".format(product_title, product_price[1:], url)
    msg = MIMEMultipart()
    msg['From'] = from_address
    msg['To'] = to_address
    msg['Subject'] = subject

    # Attach the message body to the email
    msg.attach(MIMEText(body, 'plain'))

    try:
        # Connect to the server
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # Use TLS

        # Log in to the server
        server.login(login, password)

        # Send the email
        server.sendmail(from_address, to_address, msg.as_string())

        # Disconnect from the server
        server.quit()

        print("Email sent successfully!")

    except Exception as e:
        print(f"Failed to send email. Error: {e}")

def scrap_reviews(soup):
    reviews = []
    review_container = soup.find_all('div', {'class': 'cPHDOP col-12-12'})
    for block in review_container:
        inside = block.find_all('div', {'class': 'ZmyHeo'})
        for review_ele in inside:
            review_text = review_ele.get_text(strip=True)
            reviews.append(review_text)
            # print(review_text)
    return reviews

def check_reviews(url):
    complete_review = []
    page = 1
    while True and page<=10:
        pageUrl = url + "&page=" + str(page)
        response = fetch_page(pageUrl)
        if response is None or response.status_code == 429:
            print("Failed to retrieve the page due to rate limiting.")
            return None
        print(response)
        soup = bs(response.content, 'html.parser')
        page_review = scrap_reviews(soup)
        if not page_review:
            break
        complete_review.extend(page_review)
        page += 1
    return complete_review



def get_review_link(url):
    response = fetch_page(url)
    if response is None or response.status_code == 429:
        print("Failed to retrieve the page due to rate limiting.")
        return None

    soup = bs(response.content, 'html.parser')

    # Locate the main container div
    review_divs = soup.find_all('div', {'class': 'cPHDOP col-12-12'})
    for review_div in review_divs:
        # Within the container, locate the nested anchor tag
        specific_div=review_div.find('div',{'class':'col pPAw9M'})
        if specific_div:
            # Extract the link from the anchor tag
            last_div=specific_div
    # print(last_div)
    for anchor in last_div:
        # Extract the link from the anchor tag
        link = anchor.get('href')
        if(link):
            return link
        
    return None

genai.configure(api_key=os.environ["API_KEY"])

def call_gpt_with_reviews(reviews):
    # Concatenate all reviews into a single string
    reviews_text = "\n\n".join(reviews)
    
    # Define the prompt to be sent to the model
    prompt = f"""
    You are a product review analyzer. Here are some reviews of a product:

    {reviews_text}

    Based on these reviews, please provide:
    1. Pros of the product.
    2. Cons of the product.
    3. A summary of the overall sentiment.
    4. A recommendation on whether to buy the product or not.

    Please format your response as follows:
    Pros:
    - (List of pros)

    Cons:
    - (List of cons)

    Summary:
    (Overall summary)

    Recommendation:
    (Buy/Do not buy)
    """
    
    # Initialize the model
    model = genai.GenerativeModel("gemini-pro")
    
    # Generate the response from the model
    response = model.generate_content(prompt)
    
    # Print the response text
    lis=response.text
    return lis

def sendReviewData(url,title,reviews_summary,username):
    spring_boot_url="http://localhost:8080/api/store-reviews"
    data = {
        "productLink": url,
        "username":username,
        "product_title":title,
        "review_summary":reviews_summary,
    }
    response = requests.post(spring_boot_url, json=data)
    if response.status_code == 200:
        print("Data sent to Spring Boot successfully!")
    else:
        print("Failed to send data to Spring Boot")


@api_view(['POST'])
def review_analysis(request):
    try:
        url=request.data['productLink'].strip()
        username=request.data['username']
        title,_=price_monitor(url)
        review_link=get_review_link(url)
        print(review_link)
        review_link='https://www.flipkart.com'+review_link
        lis_reviews=check_reviews(review_link)
        print(lis_reviews)
        reviews_summary=call_gpt_with_reviews(lis_reviews)
        sendReviewData(url,title,reviews_summary,username)
        return Response({'status': 200, 'message': 'Successful','reviews':reviews_summary})

    except Exception as E:
        return Response({'status':400,"error": str(E)})



# Example usage:
from_address = "kanharkarrashmi@gmail.com"
# to_address = os.getenv('CLIENT_EMAIL')
smtp_server = "smtp.gmail.com"
smtp_port = 587  # For TLS
login = "kanharkarrashmi@gmail.com"
password = os.getenv('EMAIL_PASSWORD')
account_sid = os.getenv('TWILIO_ACCOUNT_SID')
auth_token = os.getenv('TWILIO_AUTH_TOKEN')

@api_view(['POST'])
def check_condition(request):
    try:
        
        url = request.data['productLink'].strip()
        threshold = int(request.data['threshold'])
        to_address=request.data['username']
        client_no='+91'+request.data['mobile']
        website=request.data['selectedWebsite']
        print('url',url)
        print('threshold: ',threshold)
        print('mobile: ',client_no)
        print('website:',request.data['selectedWebsite'])
        if (website.lower().strip()=="flipkart"):
            product_title,product_price=price_monitor(str(url))
        elif (website.lower().strip()=="nykaa"):
            product_title,product_price=get_nykaa_product(str(url))
        elif (website.lower().strip()=="amazon"):
            product_title,product_price=get_amazon(str(url))
        elif (website.lower().strip()=="meesho"):
            product_title,product_price=get_meesho_product(str(url))
            print(product_price)
        elif (website.lower().strip()=="shopsy"):
            product_title,product_price=get_Shopsy(str(url))

        product_price = product_price.replace(",", "")
        print(product_title," ",product_price)
        product_id=send_to_spring_boot(url, product_title,product_price[1:], threshold,to_address)
        print(product_id)
        if float(product_price[1:])<=threshold:
            send_email(from_address, to_address, smtp_server,product_title,product_price, smtp_port, login, password,url)
            body = "The price for {} is now {}Rs.\nCheck it out here: {}".format(product_title, product_price[1:], url)
            try:
                client = Client(account_sid, auth_token)
                message = client.messages.create(
                    from_='+12027985017',
                    body=body,
                    to=client_no
                )
                print("Twilio Message SID:", message.sid)
                return Response({'status': 200, 'message': 'Successful', 'twilio_sid': message.sid})
            except Exception as e:
                print(f"Failed to send SMS. Error: {e}")
                return Response({'status': 500, 'error': 'Failed to send SMS', 'details': str(e)})

        else:
            start_scheduler(url, product_id, threshold, to_address,website)
        return Response({'status': 200, 'message': 'Successful'})
          
    except Exception as E:
        return Response({'status':400,"error": str(E)})


