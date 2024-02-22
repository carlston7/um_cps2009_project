from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

# Create your models here.

class Court(models.Model):
    name = models.CharField(max_length=50)
    price = models.IntegerField(default=0)
    hours = models.CharField(max_length=250)

    def __str__(self):
        return self.name


class Review(models.Model):
    restaurant = models.ForeignKey(Court, on_delete=models.CASCADE)
    user_name = models.CharField(max_length=20)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    review_text = models.CharField(max_length=500)
    review_date = models.DateTimeField('review date')

    def __str__(self):
        return f"{self.restaurant.name} ({self.review_date:%x})"