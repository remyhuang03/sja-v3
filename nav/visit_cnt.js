$("main a").click(function () {
    if (Cookies.get("login") !== undefined) {
        site_id = $(this).attr("site_id");
        fetch(`/api/global_stat/site_visit_incre.php?site_id=${site_id}`);
        console.log(`site_id=${site_id}`);
    }
})

