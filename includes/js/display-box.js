const display_num = 1;

const display_list = document.getElementById("display-list");

function hide_display_box() {
    const display_box = document.getElementById("display-box");
    display_box.style.display = "none";
}

// 创建一个作品的展示卡片
function create_display_card(data) {
    let ret = document.createElement("li");
    ret.innerHTML = `
        <li>
            <a href="" class="project-link">
                <img class="project-poster" src="" alt="project poster">
            </a>
            <div class="project-info">
                <a href="" class="author-link">
                    <img src="" class="author-avatar">
                </a>
                <div>
                    <a href="" class="project-link">
                        <h3 class="project-name"></h3>
                    </a>
                    <a href="" class="author"></a>
                </div>
            </div>
            <hr>
            <p class="project_brief"></p>
        </li>
    `

    const assets_path = 'https://sjaplus.top/assets/img/project-display/';

    ret.querySelector(".project-link").href = data['project_link'];
    ret.querySelector(".project-poster").src = assets_path+"poster/"+data['id']+'.png';
    ret.querySelector(".author-link").href = data['author_link'];
    ret.querySelector(".author-avatar").src = assets_path+"avatar/"+data['author']+'.png';
    ret.querySelector(".project-link").href = data['project_link'];
    ret.querySelector(".project-name").innerText = data['project_name'];
    ret.querySelector(".author").innerText = data['author'];
    ret.querySelector(".project_brief").innerText = data['project_brief'];

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



