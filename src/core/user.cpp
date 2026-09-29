#include "user.h"

User::User(const std::string& email) : email_(email) {
    desktop_name_ = "Desktop " + email;
}

std::string User::getEmail() const {
    return email_;
}

std::string User::getDesktopName() const {
    return desktop_name_;
}

std::string User::toJson() const {
    return "{\"email\":\"" + email_ + "\",\"desktopName\":\"" + desktop_name_ + "\"}";
}
