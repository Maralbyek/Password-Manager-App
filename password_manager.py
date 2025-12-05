import base64
import os
import random
import string

VAULT_FILE = "vault.txt"

def encrypt(text):
    return base64.b64encode(text.encode()).decode()

def decrypt(text):
    return base64.b64decode(text.encode()).decode()

def generate_password(length=12):
    characters = string.ascii_letters + string.digits + "!@#$%^&*"
    return "".join(random.choice(characters) for _ in range(length))

def save_password(site, username, password):
    with open(VAULT_FILE, "a") as f:
        record = f"{encrypt(site)}|{encrypt(username)}|{encrypt(password)}\n"
        f.write(record)
    print("\nPassword saved successfully!\n")

def view_all_passwords(show=False):
    if not os.path.exists(VAULT_FILE):
        print("\n No saved passwords yet.\n")
        return

    print("\n Saved Passwords:")
    print("-" * 50)

    with open(VAULT_FILE, "r") as f:
        for line in f:
            site, user, pwd = line.strip().split("|")
            site = decrypt(site)
            user = decrypt(user)
            pwd = decrypt(pwd)

            print(f"Website:  {site}")
            print(f"Username: {user}")

            if show:
                print(f"Password: {pwd}")
            else:
                print(f"Password: {'*' * len(pwd)}")

            print("-" * 50)

def search_password(website):
    found = False
    if not os.path.exists(VAULT_FILE):
        print("\n No saved passwords yet.\n")
        return

    with open(VAULT_FILE, "r") as f:
        for line in f:
            site, user, pwd = line.strip().split("|")
            if decrypt(site).lower() == website.lower():
                found = True
                print("\n Result:")
                print("-" * 50)
                print(f"Website:  {decrypt(site)}")
                print(f"Username: {decrypt(user)}")
                print(f"Password: {decrypt(pwd)}")
                print("-" * 50)
    
    if not found:
        print(f"\n No password found for: {website}")

def menu():
    while True:
        print("PASSWORD MANAGER")
        print("1. Save a new password")
        print("2. View saved passwords")
        print("3. View saved passwords (unmasked)")
        print("4. Search for a password")
        print("5. Generate random password")
        print("6. Exit")

        choice = input("Choose an option: ")

        if choice == "1":
            site = input("Website: ")
            username = input("Username: ")
            password = input("Password: ")

            save_password(site, username, password)

        elif choice == "2":
            view_all_passwords(show=False)

        elif choice == "3":
            view_all_passwords(show=True)

        elif choice == "4":
            website = input("Enter website to search: ")
            search_password(website)

        elif choice == "5":
            length = int(input("Password length: "))
            print("\nGenerated Password:", generate_password(length), "\n")

        elif choice == "6":
            print("Goodbye!")
            break

        else:
            print("Invalid choice, try again.\n")

if __name__ == "__main__":
    menu()