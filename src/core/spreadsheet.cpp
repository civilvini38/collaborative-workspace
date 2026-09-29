#include "spreadsheet.h"

Spreadsheet::Spreadsheet(const std::string& name) : name_(name) {}

void Spreadsheet::addRow(const std::string& item, const std::string& description, const std::string& status, const std::string& responsible) {
    rows_.push_back(item + "|" + description + "|" + status + "|" + responsible);
}

std::string Spreadsheet::toJson() const {
    std::string json = "{\"name\":\"" + name_ + "\",\"rows\":[";
    for (size_t i = 0; i < rows_.size(); ++i) {
        if (i > 0) json += ",";
        json += "\"" + rows_[i] + "\"";
    }
    json += "]}";
    return json;
}
