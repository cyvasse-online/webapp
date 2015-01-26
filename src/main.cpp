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
//#include <cyvdb/config.hpp>

using namespace std;

int main()
{
	log_init("log.xml");

	auto config = YAML::LoadFile("config.yml");
	auto listenPort = config["listenPort"].as<int>();
	auto staticDir  = config["staticDir"].as<string>();
	/*auto matchDataUrl = config["matchDataUrl"].as<string>();

	if(matchDataUrl.empty())
	{
		cerr << "Error: No database url set!" << endl;
		return 1;
	}

	cyvdb::DBConfig::glob().setMatchDataUrl(matchDataUrl);*/

	try
	{
		tnt::Tntnet app;
		tnt::TntConfig& tntConfig = tnt::TntConfig::it();

		app.listen(listenPort);
		app.setAppName("cyvasse-online");

		// setArg() and setting the documentRoot per
		// mapping require the git version of tntnet

		// static files
		app.mapUrl("^/(.+)$",                    "static@tntnet").setPathInfo("$1")
			.setArg("documentRoot", staticDir);
		app.mapUrl("^/css/(.+)$",                "static@tntnet").setPathInfo("$1")
			.setArg("documentRoot", "resources/css");

		// non-page dynamic content
		app.mapUrl("^/random-matches$", "random-game-view");

		// pages
		app.mapUrl("^/$",                            "page"  ).setArg("content", "index");
		app.mapUrl("^/index(\\.json)?$",             "page$1").setArg("content", "index");
		app.mapUrl("^/index\\.htm(l)?$",             "page"  ).setArg("content", "index");
		app.mapUrl("^/legal$",                       "page"  ).setArg("content", "legal");
		app.mapUrl("^/match/.{4}(\\.json)?$",        "page$1").setArg("content", "game");
		app.mapUrl("^/rule_sets/([^.]+)(\\.json)?$", "page$2").setArg("content", "rule-set").setArg("name", "$1");
		// 404 if nothing matched
		app.mapUrl(".*",                             "page"  ).setArg("content", "404");

		app.run();
	}
	catch(exception& e)
	{
		cerr << e.what() << endl;
		return 1;
	}

	return 0;
}
