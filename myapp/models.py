from django.db import models

# Creating User model
class User(models.Model):
    user_id = models.CharField(max_length = 20, primary_key=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email_address = models.EmailField(max_length=50, unique=True)

# Creating CourtType model
class CourtType(models.Model):
    type_id = models.AutoField(primary_key=True)

    CLAY = "C"
    GRASS = "G"
    HARD = "H"
    COURT_TYPES = [
        (CLAY, "Clay"),
        (GRASS, "Grass"),
        (HARD, "Hard")
    ]
    type = models.CharField(max_length=3, choices=COURT_TYPES, default=CLAY)

# Creating Court model
class Court(models.Model):
    court_id = models.AutoField(primary_key=True)
    type_id = models.ForeignKey("CourtType", on_delete=models.CASCADE)

# Creating Booking model
class Booking(models.Model):
    booking_id = models.AutoField(primary_key=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    cost = models.DecimalField(max_digits=5, decimal_places=2)
    court_id = models.ForeignKey("Court", on_delete=models.CASCADE)
    user_id = models.ForeignKey("User", on_delete=models.CASCADE)