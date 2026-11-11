# Paginates the home page without the jekyll-paginate gem.
#
# The home page (index.html) is page 1. This generator adds pages 2 and on at /page/<n>/,
# one for each further home_per_page notes (_config.yml, default 5). Every page renders
# _includes/home-page.html, which works out its own slice of site.posts and the pager from
# page.page_num, so all the markup stays in Liquid and this file only creates the pages.

module HomePagination
  class Generator < Jekyll::Generator
    safe true
    priority :lowest

    def generate(site)
      per = (site.config["home_per_page"] || 5).to_i
      per = 5 if per < 1
      total = (site.posts.docs.size + per - 1) / per

      (2..total).each do |n|
        page = Jekyll::PageWithoutAFile.new(site, site.source, "page/#{n}", "index.html")
        page.data["layout"] = "default"
        page.data["title"] = "Notes, page #{n}"
        page.data["page_num"] = n
        page.content = "{% include home-page.html %}"
        site.pages << page
      end
    end
  end
end
