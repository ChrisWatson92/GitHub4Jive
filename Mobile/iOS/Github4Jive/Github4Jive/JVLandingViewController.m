//
//  JVLandingViewController.m
/*
 Copyright 2014 Jive Software
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

#import "JVLandingViewController.h"
#import "JVRepoCollaboratorTableViewController.h"
#import <UIImageView+AFNetworking.h>
#import <Masonry.h>
#import "JVCommunityViewController.h"

@interface JVLandingViewController () <UITableViewDataSource,UITableViewDelegate>

@property (nonatomic) NSArray* reposList;

@property (nonatomic) UIImageView *jiveAvatarImageView;
@property (nonatomic) UIImageView *githubAvatarImageView;
@property (nonatomic) UILabel *githubUsernameLabel;
@property (nonatomic) UILabel *jiveFullNameLabel;
@property (nonatomic) UITableView *repoTableView;

@property (nonatomic) UILabel *repoTitleLabel;
@property (nonatomic) UILabel *repoSubtitleLabel;


@end

@implementation JVLandingViewController

- (id)init {
    self = [super init];
    if (self) {
        self.edgesForExtendedLayout = UIRectEdgeNone;
        
        self.reposList = [NSArray new];
    }
    return self;
}

#pragma mark - UIViewController

- (void)loadView {
    [super loadView];
    
    self.title = @"Jive ❤ Github";
    self.jiveAvatarImageView = [UIImageView new];
    self.githubAvatarImageView = [UIImageView new];
    self.repoTableView = [UITableView new];
    
    self.jiveFullNameLabel = [UILabel new];
    self.jiveFullNameLabel.font = [UIFont fontWithName:@"HelveticaNeue-Thin" size:36.0f];

    self.githubUsernameLabel = [UILabel new];
    self.githubUsernameLabel.font = [UIFont fontWithName:@"HelveticaNeue" size:16.0f];
    self.githubUsernameLabel.textColor = [UIColor blueColor];
    
    self.repoTitleLabel = [UILabel new];
    self.repoTitleLabel.font = [UIFont fontWithName:@"HelveticaNeue-Thin" size:20.0f];
    self.repoTitleLabel.text = @"My Repositories";

    self.repoSubtitleLabel = [UILabel new];
    self.repoSubtitleLabel.font = [UIFont fontWithName:@"HelveticaNeue-Thin" size:14.0f];
    self.repoSubtitleLabel.text = @"Tap to Manage Collaborators";
    
    self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:@"Logout"
                                                                              style:UIBarButtonItemStylePlain target:self action:@selector(logout)];


}

- (void)viewDidLoad {
    [super viewDidLoad];
    self.repoTableView.dataSource = self;
    self.repoTableView.delegate = self;

    [self.view addSubview:self.jiveAvatarImageView];
    [self.jiveAvatarImageView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(self.view).offset(10);
        make.height.equalTo(@80);
        make.width.equalTo(@80);
        make.left.mas_equalTo(self.view).offset(50);
    }];
    self.jiveAvatarImageView.layer.cornerRadius = 40;
    self.jiveAvatarImageView.clipsToBounds = YES;

    [self.view addSubview:self.githubAvatarImageView];
    [self.githubAvatarImageView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(self.jiveAvatarImageView);
        make.height.equalTo(@80);
        make.width.equalTo(@80);
        make.right.mas_equalTo(self.view).offset(-50);
    }];
    self.githubAvatarImageView.layer.cornerRadius = 40;
    self.githubAvatarImageView.clipsToBounds = YES;

    [self.view addSubview:self.jiveFullNameLabel];
    [self.jiveFullNameLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(self.jiveAvatarImageView.mas_bottom).offset(10);
        make.centerX.equalTo(self.view.mas_centerX);
    }];
    
    [self.view addSubview:self.githubUsernameLabel];
    [self.githubUsernameLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(self.jiveFullNameLabel.mas_bottom).offset(5);
        make.centerX.equalTo(self.view.mas_centerX);
    }];

    [self.view addSubview:self.repoTitleLabel];
    [self.repoTitleLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(self.githubUsernameLabel.mas_bottom).offset(10);
        make.centerX.equalTo(self.view.mas_centerX);
    }];
    
    [self.view addSubview:self.repoSubtitleLabel];
    [self.repoSubtitleLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(self.repoTitleLabel.mas_bottom).offset(5);
        make.centerX.equalTo(self.view.mas_centerX);
    }];

    
    [self.view addSubview:self.repoTableView];
    [self.repoTableView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.equalTo(self.repoSubtitleLabel.mas_bottom).offset(10);
        make.bottom.equalTo(self.view);
        make.left.equalTo(self.view);
        make.right.equalTo(self.view);
    }];
}

- (void) viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    [self fetchAndDisplayGithubInfo];
    [self displayJiveInfo];
    [self fetchAndDisplayMyGithubRepos];
}


# pragma mark - User Info

-(void)displayJiveInfo {
    [[self.jiveFactory jiveInstance] avatarForPerson:self.jiveMePerson onComplete:^(UIImage *avatarImage) {
        self.jiveAvatarImageView.image = avatarImage;
    } onError:^(NSError *error) {
        NSLog(@"Oops, an error occurred getting my avatar");
    }];
    self.jiveFullNameLabel.text = [self.jiveMePerson displayName];
}

-(void)fetchAndDisplayGithubInfo {
    [self.githubClient getMyUserInfo:^(JVGithubUser *user) {
        [self.githubAvatarImageView setImageWithURL:user.avatarUrl];
        self.githubMeUser = user;
        NSString *githubFriendlyName = [NSString stringWithFormat:@"@%@", user.login];
        self.githubUsernameLabel.text = githubFriendlyName;
    } onError:^(NSError *error) {
        NSLog(@"Error getting Github info %@", error);
        [[[UIAlertView alloc] initWithTitle:@"Error" message:@"An error occurred fetching your Github user info." delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil] show];
    }];
}

-(void)fetchAndDisplayMyGithubRepos {
    [self.githubClient getMyRepos:^(NSArray *reposList) {
        self.reposList = reposList;
    } onError:^(NSError *error) {
        NSLog(@"Oops, an error occurred getting my user info. %@", error);
        [[[UIAlertView alloc] initWithTitle:@"Error" message:@"An error occurred fetching your Github user info." delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil] show];
    }];
}

#pragma mark - UITableViewDataSource

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    static NSString *cellId = @"GithubRepoTableViewCell";
    
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellId];
    
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:cellId];
    }
    
    JVGithubRepo *repo = [self.reposList objectAtIndex:[indexPath row]];
    cell.textLabel.text = repo.name;
    return cell;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return [self.reposList count];
}

#pragma mark - UITableViewDelegate

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    if (self.githubMeUser != nil) {
        JVGithubRepo *selectedRepoInfo = [self.reposList objectAtIndex:[indexPath row]];
        JVRepoCollaboratorTableViewController *repoTableViewController = [JVRepoCollaboratorTableViewController new];
        repoTableViewController.jiveFactory = self.jiveFactory;
        repoTableViewController.jiveMePerson = self.jiveMePerson;
        repoTableViewController.githubClient = self.githubClient;
        repoTableViewController.githubMeUser = self.githubMeUser;
        repoTableViewController.repo = selectedRepoInfo;
        [self.navigationController pushViewController:repoTableViewController animated:YES];
    }
}

#pragma mark - Private API

-(void)setReposList:(NSArray *)reposList {
    if (_reposList != reposList) {
        _reposList = reposList;
        [self.repoTableView reloadData];
    }
}

-(void)logout {
    
    JVCommunityViewController *communityViewController = [JVCommunityViewController new];
    [self.githubClient logout];
    [self.jiveFactory logout:^{
        NSLog(@"Logged out");
    } error:^(NSError *error) {
        NSLog(@"Error logging out, bailing out anyway. %@", error);
    }];
    [self.navigationController setViewControllers:@[communityViewController]];

}

@end
