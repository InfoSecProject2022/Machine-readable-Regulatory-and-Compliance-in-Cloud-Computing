import boto3

iam = boto3.client('iam')  # importing ‘client’ from boto3

def handler(event, context): 
    updatePolicy()
    
def updatePolicy(): # password policy

    try:
        response = iam.update_account_password_policy(
            MinimumPasswordLength= 14, #Ensure minimum password length is 14 characters.
            RequireSymbols=True, # Ensure at least one symbol or non-alphanumeric character
            RequireNumbers=True, # Ensure at least one number
            RequireUppercaseCharacters=True, # Ensure at least one uppercase letter from Latin alphabet
            RequireLowercaseCharacters=True, # Ensure at least one lowercase letter from Latin alphabet.
            AllowUsersToChangePassword=True, # Allow individuals to update their password on their own based on password policy.
            MaxPasswordAge= 90,  #  Ensure password expires in 90 day(s).
            PasswordReusePrevention= 20, #  Remember last 20 password(s) and prevent password reuse.
            HardExpiry=False #
        )
        print(response)
        return response

    except Exception as e: 
        print(e)
        return (False, "cannot update" + str(e))