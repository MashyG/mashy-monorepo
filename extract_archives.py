import os
import subprocess
from pathlib import Path

def extract_archive(archive_path, extract_dir):
    """
    使用Windows内置功能解压压缩文件
    :param archive_path: 压缩文件路径
    :param extract_dir: 解压目标目录
    """
    # 确保目标目录存在
    os.makedirs(extract_dir, exist_ok=True)
    
    try:
        # 使用Windows的PowerShell命令解压文件
        command = f'powershell -command "Expand-Archive -Path \'{archive_path}\' -DestinationPath \'{extract_dir}\' -Force"'
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        
        if result.returncode == 0:
            return True
        else:
            print(f"解压失败: {result.stderr}")
            return False
    except Exception as e:
        print(f"解压 {archive_path} 时出错: {str(e)}")
        return False

def process_directory(directory):
    """
    处理指定目录下的所有压缩文件
    :param directory: 要处理的目录路径
    """
    # 支持的压缩文件扩展名
    archive_extensions = {'.zip'}
    
    # 遍历目录中的所有文件
    for file_path in Path(directory).glob('*'):
        if file_path.is_file() and file_path.suffix.lower() in archive_extensions:
            # 创建以文件名命名的目标目录
            extract_dir = file_path.parent / file_path.stem
            
            print(f"正在解压: {file_path.name}")
            if extract_archive(str(file_path), str(extract_dir)):
                print(f"成功解压到: {extract_dir}")
            else:
                print(f"解压失败: {file_path.name}")

if __name__ == '__main__':
    # 获取当前目录
    current_dir = os.getcwd()
    print(f"开始处理目录: {current_dir}")
    process_directory(current_dir)
    print("处理完成！") 