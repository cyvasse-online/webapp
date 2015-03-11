#include "page-title.hpp"

#include <fstream>
#include <map>

static const std::map<std::string, std::string> titles {
	{"404", "Page not found"},
	{"500", "Internal server error"}
};

static const std::map<std::string, std::string> ruleSetNames {
	{"mikelepage", "Mike Le Page's rule set"}
};

std::string getPageTitle(const tnt::HttpRequest& request)
{
	std::string pageTitle;
	const auto& component = request.getArg("content");

	auto it = titles.find(component);
	if (it != titles.end())
		pageTitle = it->second;
	else if (component == "legal")
	{
		const auto& queryParam = request.getQueryParams();
		if (queryParam.arg<std::string>("lang") == "de")
			pageTitle = "Impressum";
		else
			pageTitle = "Legal notice";
	}
	else if (component == "rule-set")
	{
		const auto& ruleSet = request.getArg("name");

		// TODO: Check whether ruleSet contains ".."
		std::ifstream ifs("resources/rule-sets/" + ruleSet + ".html");
		if(!ifs)
			pageTitle = "Rule set not found";
		else
		{
			ifs.close();

			auto it = ruleSetNames.find(ruleSet);
			if (it != ruleSetNames.end())
				pageTitle = it->second;
			else
				pageTitle = "ERROR – please report this";
		}
	}

	if (!pageTitle.empty())
		pageTitle += " | ";

	pageTitle += "Cyvasse Online";
	return pageTitle;
}
