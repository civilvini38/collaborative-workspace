cmake_minimum_required(VERSION 3.16)
project(collaborative_workspace LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if(EMSCRIPTEN)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -s WASM=1 -s ALLOW_MEMORY_GROWTH=1 --bind")
endif()

include_directories(${CMAKE_CURRENT_SOURCE_DIR}/src)

add_library(cpp_logic
    src/core/user.cpp
    src/core/project.cpp
    src/core/workspace.cpp
    src/core/spreadsheet.cpp
)

if(EMSCRIPTEN)
    add_executable(collaborative_workspace src/wasm/bindings.cpp)
    target_link_libraries(collaborative_workspace PRIVATE cpp_logic)
    set_target_properties(collaborative_workspace PROPERTIES SUFFIX ".js")
else()
    add_executable(collaborative_workspace_console src/wasm/bindings.cpp)
    target_link_libraries(collaborative_workspace_console PRIVATE cpp_logic)
endif()
