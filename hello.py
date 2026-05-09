v=[3,4,5,1,2,3];
l:list[int] =[];
for i in range(4):
    if i%2 !=0 and not v[i] in l:
        l.append(v[i]);
print(l);
