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

#include <tnt/ecpp.h>

#include <fstream>
#include <jsoncpp/json/value.h>
#include <jsoncpp/json/writer.h>
#include <tnt/componentfactory.h>
#include <tnt/http.h>
#include <tnt/httperror.h>
#include <tnt/httprequest.h>
#include <tnt/httpreply.h>
#include "pagemeta_reader.hpp"

class PageAsJson : public tnt::EcppComponent
{
	protected:
		virtual ~PageAsJson() = default;

	public:
		PageAsJson(const tnt::Compident& ci, const tnt::Urlmapper& um, tnt::Comploader& cl)
			: EcppComponent(ci, um, cl)
		{ }

		virtual unsigned operator() (tnt::HttpRequest&, tnt::HttpReply&, tnt::QueryParams&);
};

static tnt::EcppComponentFactoryImpl<PageAsJson> pageasjsonFactory("page.json");

unsigned PageAsJson::operator() (tnt::HttpRequest& request, tnt::HttpReply& reply, tnt::QueryParams& qparam)
{
	std::string content = request.getArg("content");
	std::string contentOutput;
	unsigned ret = HTTP_INTERNAL_SERVER_ERROR;

	// handle all pages that mustn't be called by url here
	if(content == "page" ||
		content == "page.json" ||
		content == "404" ||
		content == "500")
	{
		contentOutput = scallComp("404", request);
		ret = HTTP_NOT_FOUND;
	}
	else
	{
		try
		{
			// call content component
			contentOutput = scallComp(content, request, qparam);
			ret = HTTP_OK;
		}
		catch(tnt::NotFoundException&)
		{
			contentOutput = scallComp("404", request);
			ret = HTTP_NOT_FOUND;
		}
		catch(std::runtime_error& e)
		{
			tnt::QueryParams errorParam;
			errorParam.add("errorMessage", e.what());
			contentOutput = scallComp("500", request, errorParam);
			ret = HTTP_INTERNAL_SERVER_ERROR;
		}
	}

	PagemetaData metadata = (PagemetaReader()).getData(content);

	Json::Value replyContent;
	Json::FastWriter jsonWriter;

	replyContent["content"] = contentOutput;
	replyContent["title"] = metadata.title;

	reply.out() << jsonWriter.write(replyContent);

	reply.setContentType("application/json");
	return ret;
}
