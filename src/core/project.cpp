#include "project.h"

Project::Project(const std::string& name) : name_(name) {}

std::string Project::getName() const {
    return name_;
}

void Project::setName(const std::string& name) {
    name_ = name;
}

void Project::addSharedUser(const std::string& email) {
    shared_users_.push_back(email);
}

std::vector<std::string> Project::getSharedUsers() const {
    return shared_users_;
}

std::string Project::toJson() const {
    std::string json = "{\"name\":\"" + name_ + "\",\"sharedUsers\":[";
    for (size_t i = 0; i < shared_users_.size(); ++i) {
        if (i > 0) json += ",";
        json += "\"" + shared_users_[i] + "\"";
    }
    json += "]}";
    return json;
}
