import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import requests
from datetime import datetime
import time

def main():
    API_KEY = os.environ.get("FIREBASE_API_KEY")
    PROJECT_ID = os.environ.get("FIREBASE_PROJECT_ID", "engineering-universe")
    SENDER_EMAIL = "engisim3d@gmail.com"
    SENDER_PASSWORD = os.environ.get("EMAIL_APP_PASSWORD")

    if not API_KEY or not SENDER_PASSWORD:
        print("Missing required environment variables.")
        return

    print("Authenticating with Firebase...")
    # Authenticate as the bot user
    auth_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={API_KEY}"
    auth_resp = requests.post(auth_url, json={
        "email": "birthdaybot@engisim.com",
        "password": "BirthdayBot2026!",
        "returnSecureToken": True
    })
    
    if auth_resp.status_code != 200:
        print(f"Auth failed: {auth_resp.text}")
        return
        
    id_token = auth_resp.json().get("idToken")

    print("Fetching users from Firestore...")
    firestore_url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/users?pageSize=1000"
    headers = {"Authorization": f"Bearer {id_token}"}
    
    users_resp = requests.get(firestore_url, headers=headers)
    if users_resp.status_code != 200:
        print(f"Failed to fetch users: {users_resp.text}")
        return
        
    users_data = users_resp.json()
    documents = users_data.get("documents", [])
    
    today_str = datetime.now().strftime("-%m-%d") # e.g. -07-19
    
    birthdays_today = []
    
    for doc in documents:
        fields = doc.get("fields", {})
        email = fields.get("email", {}).get("stringValue")
        display_name = fields.get("displayName", {}).get("stringValue", "EngiSim User")
        dob = fields.get("dateOfBirth", {}).get("stringValue", "")
        
        # Check if dob matches today's month and day
        if dob.endswith(today_str) and email:
            birthdays_today.append({"email": email, "name": display_name})

    if not birthdays_today:
        print("No birthdays today.")
        return

    print(f"Found {len(birthdays_today)} birthdays today! Sending emails...")
    
    # Setup SMTP server
    try:
        server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        
        for user in birthdays_today:
            msg = MIMEMultipart()
            msg['From'] = f"EngiSim Team <{SENDER_EMAIL}>"
            msg['To'] = user['email']
            msg['Subject'] = f"Happy Birthday, {user['name']}! 🎉"
            
            body = f"""Hi {user['name']},

Wishing you a very Happy Birthday from the EngiSim Team! 🎂🚀

We hope you have a fantastic day filled with joy, and we look forward to seeing what amazing things you build next in the Engineering Simulator.

Best wishes,
The EngiSim Team
https://engineering-universe.web.app/
"""
            msg.attach(MIMEText(body, 'plain'))
            
            server.send_message(msg)
            print(f"Sent birthday email to {user['email']}")
            time.sleep(1) # Prevent rate limiting
            
        server.quit()
        print("Finished sending all birthday emails.")
        
        # Increment admin stats
        stats_url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents/admin_stats/emails?updateMask.fieldPaths=birthdayMailsSent"
        # We need to read current, increment, then patch, but Firestore REST has no direct increment without transactions or Transforms.
        # Alternatively, we can use the commit endpoint with a FieldTransform
        commit_url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents:commit"
        commit_payload = {
            "writes": [
                {
                    "transform": {
                        "document": f"projects/{PROJECT_ID}/databases/(default)/documents/admin_stats/emails",
                        "fieldTransforms": [
                            {
                                "fieldPath": "birthdayMailsSent",
                                "increment": { "integerValue": str(len(birthdays_today)) }
                            }
                        ]
                    }
                }
            ]
        }
        resp = requests.post(commit_url, headers=headers, json=commit_payload)
        if resp.status_code == 200:
            print("Successfully updated birthday stats.")
        else:
            print(f"Failed to update stats: {resp.text}")
            
    except Exception as e:
        print(f"Error sending emails: {e}")

if __name__ == "__main__":
    main()
