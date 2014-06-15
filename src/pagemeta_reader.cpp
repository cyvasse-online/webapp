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

#include "pagemeta_reader.hpp"

PagemetaReader::PagemetaReader()
{
	root = YAML::LoadFile("pagemeta.yml");
}

PagemetaData PagemetaReader::getData(const std::string& page)
{
	PagemetaData ret;

	if(root[page])
	{
		ret.title = root[page]["title"].as<std::string>() + " | ";
	}

	ret.title += "Cyvasse Online";

	return ret;
}
