#include "workspace.h"

Workspace::Workspace(const std::string& ownerEmail) : owner_email_(ownerEmail) {
    projects_.push_back(Project("Projeto inicial"));
}

std::string Workspace::createProject(const std::string& name) {
    projects_.push_back(Project(name));
    return name;
}

std::vector<Project> Workspace::getProjects() const {
    return projects_;
}

void Workspace::shareProject(const std::string& projectName, const std::string& email) {
    for (auto& project : projects_) {
        if (project.getName() == projectName) {
            project.addSharedUser(email);
            break;
        }
    }
}

std::string Workspace::toJson() const {
    std::string json = "{\"ownerEmail\":\"" + owner_email_ + "\",\"projects\":[";
    for (size_t i = 0; i < projects_.size(); ++i) {
        if (i > 0) json += ",";
        json += projects_[i].toJson();
    }
    json += "]}";
    return json;
}
