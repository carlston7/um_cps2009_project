# UM CPS2009 PROJECT

## Site URL
[https://cps2009project.azurewebsites.net/](https://cps2009project.azurewebsites.net/)

## Commit Style
Commits should be formatted with the task ID followed by a description of the task. 

**Example:**
- `ID-12 - Updated UI`
- `ID-47 & ID-18 - Changed user registration (Deleted views dir)`

All work must be pushed to the development branch or a separate feature branch. Code should only be transferred to the main branch via pull requests on GitHub.

## Planning

### User Administration
Effective immediately, work on functionality for identifying whether a user is an admin. From the frontend, this should result in a bifurcation of the user interface into:
- A UI for administrators
- A UI for members/not signed in users

### Payments
For handling payments, Stripe will be used. The relevant endpoint configuration is as follows:
- **Endpoint:** `/topup`
- **Method:** POST
- **Required Role:** Admin/Member/ClubOwner

### Court Management
For the creation and management of courts, the following endpoints are planned:

- **Create Courts (Admin)**
  - **Endpoint:** `/court`
  - **Method:** POST
  - **Required Role:** Admin

- **Edit Courts (Admin)**
  - **Endpoint:** `/court`
  - **Method:** PATCH
  - **Required Role:** Admin

### Viewing Available Courts
To facilitate viewing of available courts, the approach will be divided as follows:

1. **List Courts**
   - **Endpoint:** `/courts`
   - **Method:** GET
   - **Required Role:** Admin/Member/ClubOwner
   - **Functionality:** Returns a list of courts (A, B, C).

2. **Check Court Availability**
   - **Endpoint:** `/court-availability`
   - **Method:** GET
   - **Required Role:** Admin/Member/ClubOwner
   - **Functionality:** Returns a list of valid times that users can book for a given day. Initially, this will focus on displaying available times; booking functionality will be developed subsequently.
