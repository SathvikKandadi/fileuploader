// import React from 'react';
// import { User, X } from 'lucide-react';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// const UserProfileMenu = ({ email, onLogout }) => {
//   return (
//     <div className="absolute top-4 right-4">
//       <DropdownMenu>
//         <DropdownMenuTrigger className="outline-none">
//           <User className="h-6 w-6 cursor-pointer" />
//         </DropdownMenuTrigger>
//         <DropdownMenuContent 
//           className="w-56 mt-2" 
//           align="start" 
//           sideOffset={0}
//         >
//           <div className="flex items-center justify-between px-2 py-2 border-b">
//             <span className="text-sm font-medium">Profile</span>
//             <DropdownMenuTrigger>
//               <X className="h-4 w-4 cursor-pointer hover:text-gray-500" />
//             </DropdownMenuTrigger>
//           </div>
//           <div className="px-2 py-2 border-b">
//             <p className="text-sm text-gray-500">{email}</p>
//           </div>
//           <DropdownMenuItem 
//             className="text-red-500 cursor-pointer" 
//             onClick={onLogout}
//           >
//             Logout
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   );
// };

// export default UserProfileMenu;