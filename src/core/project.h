#ifndef PROJECT_H
#define PROJECT_H

#include <string>
#include <vector>

class Project {
public:
    Project(const std::string& name);
    std::string getName() const;
    void setName(const std::string& name);
    void addSharedUser(const std::string& email);
    std::vector<std::string> getSharedUsers() const;
    std::string toJson() const;

private:
    std::string name_;
    std::vector<std::string> shared_users_;
};

#endif
