# CHATTLY APP
```
Chat app that includes both front-end & back-end implementation
```

# TECHNOLOGIES USED
- NodeJS
- Express
- Typescript
- MongoDB
- React
- Redis (COMING SOON)

## FUNCTIONAL REQUIREMENT 
- User Account Creation
- User Account Login
- User Account Logout
- Change Password
- Reset Password
- Verify Password Reset Token
- Get User Profile
- Upload Profile Pix
- Update User Profile (user display name)
- Single Chat Connect (with optional message)
- Get Chats
- Send Chat Message
- Real-time Chat Communication (with WEB-SOCKET)
- Create Chat Group (with atleast 1 user)
- Update Chat Group Details
- Add Group Chat Members
- Remove Group Chat Members
- Leave Group Chat
- Get User Chat Groups
- Scheduled Message (like submit message to be delivered at a particular date-time or delay in seconds)
- Chat ticks implementation (for SENT, DELIVERED, RECEIVED)
- Account Email Verification (using SendGrid)
- HAVE A GENERAL CHAT GROUP SUCH THAT NEW USERS GET ADDED TO A PUBLIC GROUP & ADMIN CAN SEND MESSAGE TO EVERYONE THERE
- Delete Chat Message (low priority)
- Notfication settings
- Seed SUPER-ADMIN
- Notify of INTERNET-OFFLINE in front-end UI (so users can know they are offline & not receiving real-time messages)

## ADMIN
- Get Platform Stats (including no. of users, active-users, inactive-users, chat groups, total messages for today & yesterday, users that logged in today)
- Get users (with filter for active, username search, email search, display name, etc.)
- Enable & Disable user account
- Get Chat Groups
- Configure chat group settings (like max no. of participants in a chat-group, max length of chat-group name max no. of chat-groups to be created per day)
- OPTIONAL FEATURE : Create Public Chat Group (that will be visible to all users & ranked using the number of users joined)

## IMPROVEMENTS
- Store UUID values in BINARY for performance gain on the long run. Storing only string uses 36 chars while BINARY can use 16BYTES since `-` will be stripped off
- Include stack-trace errors for all environment excluding PRODUCTION
- Allow users change fonts for chats - about 3 different options
- Different themes
- Activate/De-activiate Chat-group or delete
- Figure out any concurrency issue that might exist