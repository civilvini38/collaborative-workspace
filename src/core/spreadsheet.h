#ifndef SPREADSHEET_H
#define SPREADSHEET_H

#include <string>
#include <vector>

class Spreadsheet {
public:
    Spreadsheet(const std::string& name);
    void addRow(const std::string& item, const std::string& description, const std::string& status, const std::string& responsible);
    std::string toJson() const;

private:
    std::string name_;
    std::vector<std::string> rows_;
};

#endif
