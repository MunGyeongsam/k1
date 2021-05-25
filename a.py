import os

#"res_root/normal"
def rename(str):
    for path, dirs, files in os.walk(str):
        print("p :", path.split('/'))
        print("d :", dirs)
        
        '''
        _1 = path.split('/')[1]

        for file in files:
            pieces = list(os.path.splitext(file))
            org = file
            if len(file) == 6:
                file = '0'+file
            file = file.replace('B', '');
            print(pieces, file)
            pieces[0] = pieces[0][:-4]
            newFile = _1 + "_" + file

            print(org, newFile)
            os.rename(path+"/"+org, path+"/"+newFile.lower())
        '''
        
        '''
        for file in files:

            new_file = 'res_marker_' + file
            os.rename(path+'/'+file, path+'/'+new_file)
        '''

rename("res_root/normal")
rename("res_root/over")
rename("res_root/select")
rename("res_root/selectover")