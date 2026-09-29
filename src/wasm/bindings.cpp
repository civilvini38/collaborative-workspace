#include <emscripten/bind.h>
#include "core/user.h"
#include "core/project.h"
#include "core/workspace.h"

using namespace emscripten;

EMSCRIPTEN_BINDINGS(collaborative_workspace) {
    class_<User>("User")
        .constructor<const std::string&>()
        .function("getEmail", &User::getEmail)
        .function("getDesktopName", &User::getDesktopName)
        .function("toJson", &User::toJson);

    class_<Project>("Project")
        .constructor<const std::string&>()
        .function("getName", &Project::getName)
        .function("setName", &Project::setName)
        .function("addSharedUser", &Project::addSharedUser)
        .function("getSharedUsers", &Project::getSharedUsers)
        .function("toJson", &Project::toJson);

    class_<Workspace>("Workspace")
        .constructor<const std::string&>()
        .function("createProject", &Workspace::createProject)
        .function("getProjects", &Workspace::getProjects)
        .function("shareProject", &Workspace::shareProject)
        .function("toJson", &Workspace::toJson);
}
