import os

def remove_substring_from_filenames(directory, substring):
    # 遍历目录中的所有文件
    for filename in os.listdir(directory):
        # 检查文件名中是否包含指定字符串
        if substring in filename:
            # 创建新的文件名
            new_filename = filename.replace(substring, '')
            # 获取完整的文件路径
            old_file = os.path.join(directory, filename)
            new_file = os.path.join(directory, new_filename)
            # 重命名文件
            os.rename(old_file, new_file)
            print(f'Renamed: {old_file} to {new_file}')

# 示例用法   
directory_path = 'D:\\Downloads\\todo'  # D:\Downloads\todo
substring_to_remove = '_callout'
remove_substring_from_filenames(directory_path, substring_to_remove)