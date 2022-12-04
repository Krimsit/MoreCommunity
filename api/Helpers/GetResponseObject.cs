using api.Models;

namespace api.Helpers;

public class GetResponseObject
{
    public ResponseCommunity Community(Community community, User? user)
    {
        ResponseCommunity responseCommunity = new ResponseCommunity()
        {
            Id = community.Id,
            Avatar = community.Avatar,
            Banner = community.Banner,
            Description = community.Description,
            Followers = community.Followers!.Length,
            Keywords = community.Keywords,
            Name = community.Name,
            isOwner = community.OwnerId == user?.Id,
            isMyFollow = user?.FollowedCommunities.Contains(community.Id) ?? false
        };

        return responseCommunity;
    }
    
    public UserResponse User(User user)
    {
        UserResponse userResponse = new UserResponse()
        {
            Id = user.Id,
            Username = user.UserName,
            Avatar = user.Avatar,
            Email = user.Email
        };

        return userResponse;
    }
    
    public PostResponse Post(Post post, User? user)
    {
        PostResponse postResponse = new PostResponse()
        {
            Id = post.Id,
            Content = post.Content,
            Likes = post.Likes.Length,
            Title = post.Title,
            CreatedAt = post.CreatedAt,
            IsMyLike = user?.LikedPosts.Contains(post.Id) ?? false,
            CommunityId = post.CommunityId
        };

        return postResponse;
    }
    
    public CommentResponse Comment(Comment comment)
    {
        CommentResponse commentResponse = new CommentResponse()
        {
            Id = comment.Id,
            Avatar = comment.Avatar,
            Username = comment.Username,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt
        };

        return commentResponse;
    }
}