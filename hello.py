v=[3,4,5,1,2,3];
l:list[int] =[];
for i in range(4):
    if i%2 ==0 and l.__contains__(v[i]):
        l.add(v[i]*12)
print(l,v)
v.append(1);
