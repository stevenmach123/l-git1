v=[3,4,5,1,2,3]
l:list[int] = []

for i in range(4):
    if i%2 !=0 or l.__contains__(v[i]):
        l.append(v[i]*200)
print(l+1)
print(v)