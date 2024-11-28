import os

# 指定文件夹路径
folder_path = 'D:\\runli-files\\images\\todo'
# 获取所有图片文件
files = os.listdir(folder_path)

# 批量重命名
for i, filename in enumerate(files):
    # print(filename)
    name, ext = os.path.splitext(filename)
    # print(name, ext)
    if ext == '':
        print(ext)
        new_name = f'{filename}.jpg'
        os.rename(os.path.join(folder_path, filename), os.path.join(folder_path, new_name))

    # if ".jpg" in filename:
    #     newFilename = filename.replace(".jpg", "")
    #     new_name = f'{newFilename}'
    #     os.rename(os.path.join(folder_path, filename), os.path.join(folder_path, new_name))