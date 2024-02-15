from django.db import models
# temporary
class Item(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

# python3 manage.py makemigrations