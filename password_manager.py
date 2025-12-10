import base64
import os
import random
import string

VAULT_FILE = "vault.txt"

def encrypt(text):
    """Encode text using base64 encryption."""
    return base64.b64encode(text.encode()).decode()

def decrypt(text):
    """Decode text using base64 decryption."""
    return base64.b64decode(text.encode()).decode()

def generate_password(length=12):
    """Generate a random password with specified length."""
    characters = string.ascii_letters + string.digits + "!@#$%^&*"
    return "".join(random.choice(characters) for _ in range(length))

def save_password(site, username, password):
    """Save encrypted password to vault file."""
    try:
        with open(VAULT_FILE, "a") as f:
            record = f"{encrypt(site)}|{encrypt(username)}|{encrypt(password)}\n"
            f.write(record)
        print("\nPassword saved successfully.\n")
        return True
    except Exception as e:
        print(f"\nError saving password: {e}\n")
        return False

def view_all_passwords(show=False):
    """Display all saved passwords, optionally showing actual passwords."""
    if not os.path.exists(VAULT_FILE):
        print("\nNo saved passwords yet.\n")
        return

    print("\nSaved Passwords:")
    print("-" * 50)

    try:
        with open(VAULT_FILE, "r") as f:
            lines = f.readlines()
            
            if not lines:
                print("No passwords stored.")
                print("-" * 50)
                return
            
            for line in lines:
                parts = line.strip().split("|")
                if len(parts) != 3:
                    continue
                    
                site, user, pwd = parts
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
    except Exception as e:
        print(f"\nError reading passwords: {e}\n")

def search_password(website):
    """Search for a password by website name."""
    if not os.path.exists(VAULT_FILE):
        print("\nNo saved passwords yet.\n")
        return

    found = False
    try:
        with open(VAULT_FILE, "r") as f:
            for line in f:
                parts = line.strip().split("|")
                if len(parts) != 3:
                    continue
                    
                site, user, pwd = parts
                if decrypt(site).lower() == website.lower():
                    found = True
                    print("\nResult:")
                    print("-" * 50)
                    print(f"Website:  {decrypt(site)}")
                    print(f"Username: {decrypt(user)}")
                    print(f"Password: {decrypt(pwd)}")
                    print("-" * 50)
                    break
        
        if not found:
            print(f"\nNo password found for: {website}\n")
    except Exception as e:
        print(f"\nError searching passwords: {e}\n")

def get_valid_integer(prompt, min_value=1, max_value=100):
    """Get valid integer input from user."""
    while True:
        try:
            value = int(input(prompt))
            if min_value <= value <= max_value:
                return value
            else:
                print(f"Please enter a number between {min_value} and {max_value}.")
        except ValueError:
            print("Invalid input. Please enter a valid number.")

def menu():
    """Main menu loop for password manager."""
    while True:
        print("\nPASSWORD MANAGER")
        print("1. Save a new password")
        print("2. View saved passwords")
        print("3. View saved passwords (unmasked)")
        print("4. Search for a password")
        print("5. Generate random password")
        print("6. Exit")

        choice = input("\nChoose an option: ").strip()

        if choice == "1":
            site = input("Website: ").strip()
            username = input("Username: ").strip()
            password = input("Password: ").strip()

            if site and username and password:
                save_password(site, username, password)
            else:
                print("\nAll fields are required.\n")

        elif choice == "2":
            view_all_passwords(show=False)

        elif choice == "3":
            view_all_passwords(show=True)

        elif choice == "4":
            website = input("Enter website to search: ").strip()
            if website:
                search_password(website)
            else:
                print("\nWebsite name is required.\n")

        elif choice == "5":
            length = get_valid_integer("Password length (8-32): ", 8, 32)
            generated = generate_password(length)
            print(f"\nGenerated Password: {generated}\n")

        elif choice == "6":
            print("\nGoodbye.")
            break

        else:
            print("\nInvalid choice. Please try again.\n")

if __name__ == "__main__":
    menu()
