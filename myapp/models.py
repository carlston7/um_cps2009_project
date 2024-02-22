from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

# class Review(models.Model):
#     restaurant = models.ForeignKey(Court, on_delete=models.CASCADE)
#     user_name = models.CharField(max_length=20)
#     rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
#     review_text = models.CharField(max_length=500)
#     review_date = models.DateTimeField('review date')

#     def __str__(self):
#         return f"{self.restaurant.name} ({self.review_date:%x})"
