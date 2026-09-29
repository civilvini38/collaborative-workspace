#ifndef USER_H
#define USER_H

#include <string>

class User {
public:
    User(const std::string& email);
    std::string getEmail() const;
    std::string getDesktopName() const;
    std::string toJson() const;

private:
    std::string email_;
    std::string desktop_name_;
};

#endif
