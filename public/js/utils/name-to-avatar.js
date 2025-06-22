const GetAvatarByName = (name) => {
    let mod = 0;
    for (let i = 0, len = name.length; i < len; i++) {
        mod = ((mod * 5) + name.charCodeAt(i)) % 6;
    }
    return `"../images/avatar_${mod + 1}.png"`;
}

export default GetAvatarByName;
