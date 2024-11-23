# Définir les paramètres
$users = @(
    @{FirstName='John'; LastName='Doe'; Username='jdoe'; Password='P@ssw0rd'; Group='OU=Users,DC=domain,DC=com'},
    @{FirstName='Jane'; LastName='Smith'; Username='jsmith'; Password='P@ssw0rd'; Group='OU=Users,DC=domain,DC=com'}
)

# Boucle pour créer les utilisateurs
foreach ($user in $users) {
    $userPrincipalName = "$($user.Username)@domain.com"
    $securePassword = ConvertTo-SecureString $user.Password -AsPlainText -Force

    # Créer l'utilisateur
    New-ADUser -Name "$($user.FirstName) $($user.LastName)" `
               -GivenName $user.FirstName `
               -Surname $user.LastName `
               -SamAccountName $user.Username `
               -UserPrincipalName $userPrincipalName `
               -AccountPassword $securePassword `
               -Enabled $true `
               -PassThru

    # Ajouter l'utilisateur au groupe
    Add-ADGroupMember -Identity $user.Group -Members $user.Username
}

Write-Host "Utilisateurs créés et ajoutés au groupe avec succès."
