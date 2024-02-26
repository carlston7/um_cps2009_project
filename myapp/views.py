from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
import os
from django.http import JsonResponse


def test_api(request):
    return JsonResponse({"message": "Hello from Django!"})


def frontend(request):
    index_file_path = os.path.join(settings.FRONTEND_BUILD_DIR, 'index.html')
    try:
        with open(index_file_path, 'r') as file:
            return HttpResponse(file.read())
    except FileNotFoundError:
        return HttpResponse("Error: The index.html file does not exist", status=404)


# def javascriptfile(request):
#     index_file_path = os.path.join(settings.FRONTEND_BUILD_DIR, 'static/js/main.71cb23ab.js')
#     try:
#         with open(index_file_path, 'r') as file:
#             return HttpResponse(file.read())
#     except FileNotFoundError:
#         return HttpResponse("Error: The index.html file does not exist", status=404)


# def cssfile(request):
#     index_file_path = os.path.join(settings.FRONTEND_BUILD_DIR, 'static/css/main.f855e6bc.css')
#     try:
#         with open(index_file_path, 'r') as file:
#             return HttpResponse(file.read())
#     except FileNotFoundError:
#         return HttpResponse("Error: The index.html file does not exist", status=404)
