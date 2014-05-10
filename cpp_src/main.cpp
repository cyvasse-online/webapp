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
#include <tnt/tntconfig.h>
#include <tnt/tntnet.h>
#include <cxxtools/jsondeserializer.h>

int main()
{
	try
	{
		tnt::Tntnet app;
		tnt::TntConfig& config = tnt::TntConfig::it();

		std::ifstream in("webapp-conf.json");
		if(!in)
		{
			std::cerr << "webapp-conf.json not found – did you run the "
			             "webapp from the root of the build directory?"
			          << std::endl;
			exit(1);
		}

		cxxtools::JsonDeserializer deserializer(in);
		deserializer.deserialize();
		deserializer.si()->getMember("documentRoot")
			.getValue(config.documentRoot);

		in.close();

		app.listen(2517);
		app.setAppName("cyvasse-online");

		// static files
		app.mapUrl("^/(.+)$", "static@tntnet").setPathInfo("$1");

		// dynamic content
		app.mapUrl("^/$",           "page").setArgs({{"content", "index"}});
		app.mapUrl("^/match/(.*)$", "page").setArgs({{"content", "game"}});

		app.run();
	}
	catch(std::exception& e)
	{
		std::cerr << e.what() << std::endl;
		return 1;
	}

	return 0;
}
