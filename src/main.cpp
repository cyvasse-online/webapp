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
#include <csignal>
#include <cstdio>

#include <unistd.h>
#include <tnt/tntconfig.h>
#include <tnt/tntnet.h>
#include <cxxtools/log.h>
#include <yaml-cpp/yaml.h>

using namespace std;

static constexpr const char* pidFileName = "cyvasse-online.pid";

void createPidFile();
void removePidFile();
void setupSignals();

int main()
{
	setupSignals();

	log_init("log.xml");

	auto config = YAML::LoadFile("config.yml");
	auto listenPort = config["listenPort"].as<int>();
	auto staticDir  = config["staticDir"].as<string>();

	int retVal = 0;

	try
	{
		createPidFile();

		tnt::Tntnet app;

		app.listen(listenPort);
		app.setAppName("cyvasse-online");

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
		retVal = 1;
	}

	removePidFile();
	return retVal;
}

void createPidFile()
{
	ofstream pidFile(pidFileName);
	if(pidFile)
	{
		pidFile << getpid() << endl;
		pidFile.close();
	}
}

void removePidFile()
{
	remove(pidFileName);
}

extern "C" void stopWebapp(int /* signal */)
{
	removePidFile();
	exit(0);
}

void setupSignals()
{
#ifdef HAVE_SIGACTION
	struct sigaction newAction, oldAction;

	// setup sigaction struct for stopWebapp
	newAction.sa_handler = stopWebapp;
	sigemptyset(&newAction.sa_mask);
	newAction.sa_flags = 0;

	sigaction(SIGHUP, nullptr, &oldAction);
	if(oldAction.sa_handler != SIG_IGN)
		sigaction(SIGHUP, &newAction, nullptr);

	sigaction(SIGINT, nullptr, &oldAction);
	if(oldAction.sa_handler != SIG_IGN)
		sigaction(SIGINT, &newAction, nullptr);

	sigaction(SIGTERM, nullptr, &oldAction);
	if(oldAction.sa_handler != SIG_IGN)
		sigaction(SIGTERM, &newAction, nullptr);
#else
	if(signal(SIGHUP, stopWebapp) == SIG_IGN)
		signal(SIGHUP, SIG_IGN);

	if(signal(SIGINT, stopWebapp) == SIG_IGN)
		signal(SIGINT, SIG_IGN);

	if(signal(SIGTERM, stopWebapp) == SIG_IGN)
		signal(SIGTERM, SIG_IGN);
#endif
}
