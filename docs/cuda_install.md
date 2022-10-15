# CUDA11.6 + CUDNN 安装教程

## 请确保你已经安装了 VisualStudio2019

## Step 1
[点这里下载CUDA11.6](https://developer.download.nvidia.com/compute/cuda/11.6.0/local_installers/cuda_11.6.0_511.23_windows.exe)

## Step 2
无脑安装 可以换目录的 但是一定要记得你装哪里去了

## Step 3
[在这里下载CUDNN,需要注册](https://developer.nvidia.com/rdp/cudnn-download)

不想注册或者觉得太慢了的话

进群下载 Q815818430

## Step 4
复制 cuDNN bin 目录下的文件到 CUDA 的 bin 目录下（.dll）

复制 cuDNN include 目录下的文件到 CUDA 的 include 目录下（.h）

复制 cuDNN lib/x64 目录下的文件到 CUDA 的 lib/x64 目录下（.lib）

添加环境变量，把 CUDA安装目录/lib/x64 加到 系统环境变量 中(不会的自己百度)
