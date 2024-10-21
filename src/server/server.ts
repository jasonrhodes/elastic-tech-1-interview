import axios from "axios";
import cors from "cors";
import express, { Request, Response } from "express";
import querystring from "querystring";
import { SSRRoute } from "./ssr";

const PORT = 3001;

const app = express();
SSRRoute(app);

// Types
type ErrorResponse = {
  error?: string;
};

type APIResponse<ResponseBody> = {
  data: ResponseBody | ErrorResponse;
};

type MediaRequestQueryParams = {
  q: string;
  page: number;
};

type MediaItem = {
  nasa_id: string;
  center: string;
  date_created: string;
  description: string;
  keywords: string[];
  title: string;
  thumbnail_href?: string;
};

type MediaResponse = {
  total_hits: number;
  items: MediaItem[];
};

var corsOptions = {
  origin: `*`,
};

// Routes
// A wrapper around NASA's images API: https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf
app.get(
  "/api/media",
  cors(corsOptions),
  async (
    req: Request<any, any, any, MediaRequestQueryParams>,
    res: Response<APIResponse<MediaResponse>>
  ) => {
    try {
      const response = await axios.get(
        `https://images-api.nasa.gov/search?${querystring.encode({
          ...req.query,
          media_type: "image",
        })}`
      );

      const items: MediaItem[] = [];

      response.data.collection.items.forEach((item) => {
        items.push({
          ...item.data[0],
          thumbnail_href: item.links
            ? item.links.find(
                (link) => link.rel === "preview" && link.render === "image"
              )?.href
            : undefined,
        });
      });

      res.json({
        data: {
          total_hits: response.data.collection.metadata.total_hits,
          items,
        },
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        data: { error: "Something went wrong" },
      });
    }
  }
);

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
