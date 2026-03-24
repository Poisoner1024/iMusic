#!/usr/bin/env python3
"""
PDF to Markdown Converter
将 PDF 文件转换为 Markdown 格式
"""

import sys
import re
from pathlib import Path

try:
    import pdfplumber
except ImportError:
    print("Error: pdfplumber not installed")
    print("Run: pip install pdfplumber")
    sys.exit(1)


def extract_text_from_pdf(pdf_path):
    """从 PDF 文件中提取文本"""
    print(f"正在读取 PDF 文件: {pdf_path}")
    text_content = []

    try:
        with pdfplumber.open(pdf_path) as pdf:
            print(f"PDF 共 {len(pdf.pages)} 页")
            for i, page in enumerate(pdf.pages, 1):
                text = page.extract_text()
                if text:
                    text_content.append({
                        'page': i,
                        'text': text
                    })
                    print(f"已提取第 {i}/{len(pdf.pages)} 页")
    except Exception as e:
        print(f"错误: 无法读取 PDF 文件: {e}")
        sys.exit(1)

    return text_content


def convert_to_markdown(text_content, output_path):
    """将提取的文本转换为 Markdown 格式"""
    print(f"\n正在转换为 Markdown 格式...")

    markdown_lines = []
    markdown_lines.append("# IM公益声传社团\n")
    markdown_lines.append(f"\n*本文档由 PDF 自动转换生成*\n")
    markdown_lines.append("---\n")

    for item in text_content:
        page_num = item['page']
        text = item['text']

        # 清理文本
        text = text.strip()

        # 跳过空页面
        if not text:
            continue

        markdown_lines.append(f"\n## 第 {page_num} 页\n\n")
        markdown_lines.append(text)
        markdown_lines.append("\n")

    # 写入文件
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.writelines(markdown_lines)
        print(f"\n✓ 成功保存到: {output_path}")
    except Exception as e:
        print(f"错误: 无法写入文件: {e}")
        sys.exit(1)


def main():
    if len(sys.argv) != 2:
        print("使用方法: python3 convert_pdf_to_md.py <pdf_file>")
        print("示例: python3 convert_pdf_to_md.py document.pdf")
        sys.exit(1)

    pdf_path = sys.argv[1]

    # 检查文件是否存在
    if not Path(pdf_path).exists():
        print(f"错误: 文件不存在: {pdf_path}")
        sys.exit(1)

    # 检查是否为 PDF 文件
    if not pdf_path.lower().endswith('.pdf'):
        print(f"错误: 文件不是 PDF 格式: {pdf_path}")
        sys.exit(1)

    # 生成输出文件名
    pdf_path_obj = Path(pdf_path)
    output_path = pdf_path_obj.stem + ".md"

    # 提取文本
    text_content = extract_text_from_pdf(pdf_path)

    if not text_content:
        print("错误: 无法从 PDF 中提取文本")
        sys.exit(1)

    # 转换为 Markdown
    convert_to_markdown(text_content, output_path)

    print("\n✓ 转换完成！")


if __name__ == "__main__":
    main()
