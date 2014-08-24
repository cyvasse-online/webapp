/* Copyright 2014 Jonas Platte
 *
 * This file is part of Cyvasse Online.
 *
 * Cyvasse Online is free software: you can redistribute it and/or modify it under the
 * terms of the GNU Affero General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or (at your option) any later version.
 *
 * Cyvasse Online is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
 * PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with this program.
 * If not, see <http://www.gnu.org/licenses/>.
 */

#include <fstream>
#include <iostream>
#include <string>
#include <tnt/tntconfig.h>
#include <tnt/tntnet.h>
#include <cxxtools/log.h>
#include <yaml-cpp/yaml.h>
#include <cyvdb/config.hpp>

int main()
{
	log_init("log.xml");

	auto config = YAML::LoadFile("config.yml");
	auto listenPort   = config["listenPort"].as<int>();
	auto matchDataUrl = config["matchDataUrl"].as<std::string>();

	if(matchDataUrl.empty())
	{
		std::cerr << "Error: No database url set!" << std::endl;
		return 1;
	}

	cyvdb::DBConfig::glob().setMatchDataUrl(matchDataUrl);

	try
	{
		tnt::Tntnet app;
		tnt::TntConfig& config = tnt::TntConfig::it();

		// still relying on the webapp being executed from top_builddir
		config.documentRoot = "static";

		app.listen(listenPort);
		app.setAppName("cyvasse-online");

		// setArg() and setting the documentRoot per
		// mapping require the git version of tntnet

		// static files
		app.mapUrl("^/(.+)$",          "static@tntnet").setPathInfo("$1");
		app.mapUrl("^/rule_sets/(.+)", "static@tntnet").setPathInfo("$1").setArg("documentRoot", "rule_sets");

		// dynamic content
		app.mapUrl("^/$",                       "page"  ).setArg("content", "index");
		app.mapUrl("^/index(\\.json)?$",        "page$1").setArg("content", "index");
		app.mapUrl("^/index\\.htm(l)?$",        "page"  ).setArg("content", "index");
		app.mapUrl("^/disclaimer$",             "page"  ).setArg("content", "disclaimer");
		app.mapUrl("^/create-game(\\.json)?$",  "page$1").setArg("content", "create-game");
		app.mapUrl("^/join-game(\\.json)?$",    "page$1").setArg("content", "join-game");
		app.mapUrl("^/match/.{4}(\\.json)?$",   "page$1").setArg("content", "game");

		app.run();
	}
	catch(std::exception& e)
	{
		std::cerr << e.what() << std::endl;
		return 1;
	}

	return 0;
}
