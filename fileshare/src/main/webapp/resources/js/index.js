function createFolder(parentId){
    let name = document.getElementById("innerFolderName_" + parentId).value;

    console.log("createFolder id:" + parentId + "name:" + name);
    $.ajax({
        url: 'http://localhost:8080/folder/create',
        type: 'POST',
        data: {name: name , parentId: parentId},
        success: function (res) {
            console.log(res);
            location.reload();
        }
    });

}

function updateFolderName(id){
    const name = document.getElementById("folderName_" + id).value;

    console.log("updateFolderName id:" + id + "newName:" + name);
    $.ajax({
        url: 'http://localhost:8080/folder/update',
        type: 'PUT',
        data: {id: id, newName: name},
        success: function (res) {
            console.log(res);
            location.href= "http://localhost:8080/";
            location.reload();
        }
    });

}

function updateFolderParent(id){
    const parentId = document.getElementById("folderParent_" + id).value;
    console.log("updateFolderParent id:" + id + "parentId:" + parentId);

    $.ajax({
        url: 'http://localhost:8080/folder/update',
        type: 'PUT',
        data: {id: id, newParentId: parentId},
        success: function (res) {
            console.log(res);
            location.href= "http://localhost:8080/";
            location.reload();
        }
    });

}
function deleteFolder(id){
    console.log("deleteFolder id:" + id);
    $.ajax({
        url: 'http://localhost:8080/folder/delete',
        type: 'DELETE',
        data: {id: id},
        success: function (res) {
            console.log(res);
            location.href= "http://localhost:8080/";

            location.reload();
        }
    });
}

function deleteFile(id){
    console.log("deleteFolder id:" + id);
    $.ajax({
        url: 'http://localhost:8080/file/delete',
        type: 'DELETE',
        data: {id: id},
        success: function (res) {
            console.log(res);
            location.href= "http://localhost:8080/";

            location.reload();
        }
    });
}

function createLink(id){
    console.log("createLink id:" + id);
    $.ajax({
        url: 'http://localhost:8080/link/create',
        type: 'POST',
        data: {id: id},
        success: function (res) {
            console.log(res);
            $("#createLink_" + id).val(res);
        }
    });
}

function visitLink(){
    const generatedName = document.getElementById("visitLink").value;

    console.log("visitLink generatedName:" + generatedName);
    $.ajax({
        url: 'http://localhost:8080/link/' + generatedName,
        type: 'GET'
    });
}


function deleteLink(){

    const generatedName = document.getElementById("linkDelete").value;

    console.log("deleteLink generatedName:" + generatedName);
    $.ajax({
        url: 'http://localhost:8080/link/delete',
        type: 'DELETE',
        data: {generatedName: generatedName},
        success: function (res) {
            console.log(res);
            location.reload();
        }
    });
}
