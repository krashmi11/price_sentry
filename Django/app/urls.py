from django.contrib import admin
from django.urls import path
from .views import *

urlpatterns = [
    path('',test),
    path('check-condition/',check_condition),
    path('review-analysis/',review_analysis),
    path('compare-price/',compare_prices)
]
