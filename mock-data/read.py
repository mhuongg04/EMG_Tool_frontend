def read_and_extract(filename):
    start_keywords = ["\"*Screen Wave\"", "\"*Gather Wave\"", '\"*Monitor Wave\"']
    end_keyword = "\"Wave End\""
    extracted_sections = []
    current_section = []

    with open(filename, 'r', encoding='utf-8') as file:
        in_section = False
        for line in file:
            if any(keyword in line for keyword in start_keywords):
                in_section = True
            elif end_keyword in line:
                in_section = False
                if current_section:
                    extracted_sections.append(''.join(current_section))
                    current_section = []
            elif in_section:
                current_section.append(line)

        if current_section:
            extracted_sections.append(''.join(current_section))
        
        sections = [[] for _ in range(len(extracted_sections))]
        for i, section in enumerate(extracted_sections):
            lines = section.split('\n')
            for line in lines:
                sections[i].append(line.strip())


        column_lists= [[] for _ in range(len(extracted_sections))]
        for i, section in enumerate(extracted_sections):
            lines = section.split('\n')
            if len(lines) > 1:  
                extracted_data_new = lines[1:]
                column_lists[i] = [[] for _ in range(len(extracted_data_new[0].split(',')))]
                for row in extracted_data_new:
                    for j, value in enumerate(row.split(',')):
                        cleaned_value = value.strip('"').strip('\n')
                        if cleaned_value != '':
                            int_value = int(cleaned_value)
                            column_lists[i][j].append(int_value)
                column_lists[i] = [sublist for sublist in column_lists[i] if sublist]
            # column_list_new = np.array(column_lists, dtype=int)

    return column_lists

if __name__ == '__main__':

    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("file", help="file to read", type=str)
    parser.add_argument("-o", "--output", dest='output', help="file to write output, default to stdout", type=str)
    
    args = parser.parse_args()
    filename = args.file
    result = read_and_extract(filename)
    if(args.output):
        output_filename = args.output
        with open(output_filename, 'w') as f:
            print(result, file=f)
    else:
        print(result)