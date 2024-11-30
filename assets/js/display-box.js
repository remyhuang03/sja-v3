const display_num = 5;

const display_list = document.getElementById("display-list");

function hide_display_box() {
    const display_box = document.getElementById("display-box");
    display_box.style.display = "none";
}

// 创建一个作品的展示卡片
function create_display_card(data) {
    let ret = document.createElement("li");

    const assets_path = 'https://sjaplus.top/assets/img/project-display/';
    
    ret.innerHTML = `
        <a href="${data['project_link']}" class="project-link">
            <img class="project-poster" src="${assets_path + "poster/" + data['id'] + ".png"}" alt="project poster">
        </a>
        <div class="project-info">
            <a href="${data['author_link']}" class="author-link">
                <img src="${assets_path + "avatar/" + data['id'] + '.png'}" class="author-avatar">
            </a>
            <div>
                <a href="${data['project_link']}" class="project-link">
                    <h3 class="project-name">${data['project_name']}</h3>
                </a>
                <a href="${data['author_link']}" class="author">${data['author']}</a>
            </div>
        </div>
        <hr>
        <p class="project-brief">${data['project_brief']}</p>`;

    return ret;

}

// 渲染作品展示列表
function render_display_list(data) {
    for (let i = 0; i < data.length; i++) {
        const display_card = create_display_card(data[i]);
        display_list.appendChild(display_card);
    }
}


fetch('https://sjaplus.top/api/get-display.php?n=' + display_num)
    .then(response => {
        // 检查响应是否成功
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        // 检查API返回状态
        if (data['status'] == 'error') {
            throw new Error('API error: ' + data['message']);
        }
        render_display_list(data['projects']);
    }
    )
    .catch(error => {
        console.error('Error fetching project display list:', error);
        hide_display_box();
    });



