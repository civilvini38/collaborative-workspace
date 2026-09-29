#ifndef WORKSPACE_H
#define WORKSPACE_H

#include <string>
#include <vector>
#include "project.h"

class Workspace {
public:
    Workspace(const std::string& ownerEmail);
    std::string createProject(const std::string& name);
    std::vector<Project> getProjects() const;
    void shareProject(const std::string& projectName, const std::string& email);
    std::string toJson() const;

private:
    std::string owner_email_;
    std::vector<Project> projects_;
};

#endif
