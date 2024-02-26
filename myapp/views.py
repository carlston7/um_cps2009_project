from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
import os
from django.http import JsonResponse

def test_api(request):
    return JsonResponse({"message": "Hello from Django!"})

def frontend(request):
    index_file_path = os.path.join(settings.STATICFILES_DIRS, 'index.html')
    try:
        with open(index_file_path, 'r') as file:
            return HttpResponse(file.read())
    except FileNotFoundError:
        return HttpResponse("Error: The index.html file does not exist", status=404)

