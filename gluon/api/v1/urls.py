from .views import (
    BusinessEndPoint, BusinessUserEndPoint, CategoryEndPoint, SubCategoryEndPoint, ItemEndPoint, ItemImageEndPoint, StockEndPoint, ExpenditureEndPoint, OrderEndPoint, OrderItemEndPoint
)
from django.urls import re_path
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    re_path(r'^business/$', BusinessEndPoint.as_view()),
    re_path(r'^businessuser/$', BusinessUserEndPoint.as_view()),
    re_path(r'^category/$', CategoryEndPoint.as_view()),
    re_path(r'^subcategory/$', SubCategoryEndPoint.as_view()),
    re_path(r'^item/$', ItemEndPoint.as_view()),
    re_path(r'^itemimage/$', ItemImageEndPoint.as_view()),
    re_path(r'^stock/$', StockEndPoint.as_view()),
    re_path(r'^expenditure/$', ExpenditureEndPoint.as_view()),
    re_path(r'^order/$', OrderEndPoint.as_view()),
    re_path(r'^orderitem/$', OrderItemEndPoint.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns, allowed=["json"])
