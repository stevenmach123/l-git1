v=[3,4,5,1,2,3]
l =[]
for i in range(4):
    if i%2 ==0 and not l.__contains__(v[i]):
        l.append(v[i])
print(l)

# com1 com3-merge com2-merge 
# com2 com2-pow com3-chic 
# com3 com3-pow com3-lamp